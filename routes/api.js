'use strict';

module.exports = function (app, Issues) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      
      let project = req.params.project;
      let query ={project: project};
      console.log('GET called', req.query)
      for (var prop in req.query) {
            if (Object.prototype.hasOwnProperty.call(req.query, prop)) {
                // do stuff
              if (req.query[prop] != '' && prop!='open'){
                query[prop] = req.query[prop]; 
                
              }else if(prop=='open' && req.query[prop]=='true'){
                query[prop] = true;
              }else if(prop=='open' && req.query[prop]=='false'){
                query[prop] = false;
              }
              
            }
        }
      console.log(query);
      try{
        const issue = await Issues.find(query).select({__v:0, poject:0}).exec();
        
        res.json(issue);
      }catch(err){
        res.json({error:err})
      }
      
      //array with all issues for that project
    })
    
    .post(async function (req, res){
      console.log('POST called')
      
      let project = req.params.project;
      try{
      const newIssue = new Issues({
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to?req.body.assigned_to:"",
        status_text: req.body.status_text?req.body.status_text:"",
        project: project
      });
      
        const doc = await newIssue.save();
        console.log(doc.issue_title)
        res.json({
          open:doc.open,
          _id:doc._id,
          issue_title:doc.issue_title,
          issue_text:doc.issue_text,
          created_by:doc.created_by,
          assigned_to:doc.assigned_to,
          status_text:doc.status_text,
          created_on:doc.created_on,
          updated_on:doc.updated_on
        });
      }catch(error){
        res.json({ error: 'required field(s) missing' });
      }
   
    })
    
    .put(async function (req, res){
      //console.log('PUT called');
      
      let project = req.params.project;
      const _id =req.body._id;
      console.log(req.body)
      if(_id){
        try{
          if(Object.keys(req.body).length > 1){
          let doc = await Issues.findById(_id);
          if (doc){
            let change = false;

        for (var prop in doc) {
            if (Object.prototype.hasOwnProperty.call(req.body, prop)) {
                // do stuff
              if (req.body[prop] != '' && prop!='_id'){
                doc[prop] = req.body[prop]; 
                //console.log(prop,' changed to ',doc[prop])
                change=true;
              }
              
            }
        }
        console.log('is changed: ', change);
         
        
          doc.updated_on = new Date();
          //console.log('new doc:', doc);
          try{
            const updatedIssue = await doc.save();
            //console.log('success')
            res.json({  result: 'successfully updated', '_id': _id });
          }catch(err){
            //console.log(err)
            res.json({ error: 'could not update', '_id': _id });
          }
        
          }else{
            //console.log(doc)
            res.json({ error: 'could not update', '_id': _id });
          }
          }else{
          //console.log('no update fields')
          res.json({ error: 'no update field(s) sent', '_id': _id });
        }
        }catch(err){
          //console.log(err)
        res.json({ error: 'could not update', '_id': _id });
      }
      }else{
        //without id
        res.json({ error: 'missing _id' });
      }
      
      
    })
    
    .delete(async function (req, res){
      let project = req.params.project;
      console.log('DELETE called');
      
      const _id = req.body._id;
      console.log(_id);
      if(_id){
        try {
        const result = await Issues.deleteOne({_id:_id});
        if(result.deletedCount>0){
          res.json({ result: 'successfully deleted', '_id': _id });
        }else{
          res.json({ error: 'could not delete', '_id': _id });
        }
      }catch(err){
        
        res.json({ error: 'could not delete', '_id': _id });
      }
      }else{
        console.log('missing id')
        res.json({ error: 'missing _id' });
      }
      
    });
    
};
