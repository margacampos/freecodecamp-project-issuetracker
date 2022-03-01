'use strict';

module.exports = function (app, Issues) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      let project = req.params.project;
      let query ={issue_title: project};
      for (var prop in req.query) {
            if (Object.prototype.hasOwnProperty.call(req.query, prop)) {
                // do stuff
              if (req.query[prop] != '' && prop!='_id'){
                query[prop] = req.query[prop]; 
              }
              
            }
        }
      try{
        const issue = await Issues.find(query).select({__v:0}).exec();
      res.json(issue);
      }catch(err){
        res.json({error:err})
      }
      
      //array with all issues for that project
    })
    
    .post(async function (req, res){
      let project = req.params.project;

      const newIssue = new Issues({
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text
      });
      try{
        const doc = await newIssue.save();
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
      let project = req.params.project;
      let {_id} =req.body;
      console.log(_id);
      if(_id){
        let doc = await Issues.findById(_id);
        //other error
        let change = false;
        for (var prop in doc) {
            if (Object.prototype.hasOwnProperty.call(req.body, prop)) {
                // do stuff
              if (req.body[prop] != '' && prop!='_id'){
                doc[prop] = req.body[prop]; 
                change = true;
              }
              
            }
        }
        if(change){
          doc.updated_on = new Date();
          try{
            const updatedIssue = await doc.save();
            res.json({  result: 'successfully updated', '_id': updatedIssue._id });
          }catch(err){
            res.json({ error: 'could not update', '_id': _id });
          }
        }else{
          res.json({ error: 'no update field(s) sent', '_id': _id });
        }
      }else{
        //without id
        res.json({ error: 'missing _id' });
      }
      
      
    })
    
    .delete(async function (req, res){
      let project = req.params.project;
      const _id = req.body._id;
      if(_id){
        try {
        await Issues.deleteOne({_id:_id});
        res.json({ result: 'successfully deleted', '_id': _id });
      }catch(err){
        res.json({ error: 'could not delete', '_id': _id });
      }
      }else{
        res.json({ error: 'missing _id' });
      }
      
    });
    
};
