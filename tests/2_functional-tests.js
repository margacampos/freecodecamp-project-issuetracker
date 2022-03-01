const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(5000);
  suite('Integration tests with chai-http', function () {
    // #1
    test('Test POST /api/issues/{project} with every field', function (done) {
      chai
        .request(server)
        .post('/api/issues/apitest')
        .send({
          issue_title: "apitest",
          issue_text: "New test issue",
          created_by: "Chai",
          assigned_to: "margacampos",
          status_text: "In QA"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "apitest")
          assert.equal(res.body.issue_text, "New test issue");
          assert.equal(res.body.created_by, "Chai");
          assert.equal(res.body.assigned_to, "margacampos");
          assert.equal(res.body.status_text, "In QA");
          expect(res.body).to.have.property('updated_on');
          expect(res.body).to.have.property('created_on');
          expect(res.body).to.have.property('_id');
          expect(res.body).to.have.property('open');
          assert.equal(res.body.open, true);
          done();
        });
    });
    // #2
    test('Test POST /api/issues/{project} with only required fields', function (done) {
      chai
        .request(server)
        .post('/api/issues/apitest')
        .send({
          issue_title: "apitest",
          issue_text: "New test issue 2",
          created_by: "Chai"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "apitest")
          assert.equal(res.body.issue_text, "New test issue 2");
          assert.equal(res.body.created_by, "Chai");
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          expect(res.body).to.have.property('open');
          expect(res.body).to.have.property('updated_on');
          expect(res.body).to.have.property('created_on');
          expect(res.body).to.have.property('_id');
          assert.equal(res.body.open, true);
          done();
        });
    });
    // #3
    test('Test POST /api/issues/{project} with missing required fields', function (done) {
      chai
        .request(server)
        .post('/api/issues/apitest')
        .send({
          issue_title: "apitest",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'required field(s) missing' );
          done();
        });
    });
    //#4
    test('Test GET /api/issues/{project}', function (done) {
      chai
        .request(server)
        .get('/api/issues/apitest')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          expect(res.body).to.be.an('array', 'is not an array');
          for(let i=0; i<res.body.length; i++){
            expect(res.body[i], `${res.body[i]} does not have property _id`).to.have.property('_id');
            expect(res.body[i], `${res.body[i]} does not have property issue_title`).to.have.property('issue_title');
            expect(res.body[i], `${res.body[i]} does not have property issue_text`).to.have.property('issue_text');
            expect(res.body[i], `${res.body[i]} does not have property created_on`).to.have.property('created_on');
            expect(res.body[i], `${res.body[i]} does not have property updated_on`).to.have.property('updated_on');
            expect(res.body[i], `${res.body[i]} does not have property created_by`).to.have.property('created_by');
            expect(res.body[i], `${res.body[i]} does not have property assigned_to`).to.have.property('assigned_to');
            expect(res.body[i], `${res.body[i]} does not have property open`).to.have.property('open');
            expect(res.body[i], `${res.body[i]} does not have property status_text`).to.have.property('status_text');
          }
          done();
        });
    });
    //#5
    test('Test GET /api/issues/{project} with one filter', function (done) {
      chai
        .request(server)
        .get('/api/issues/apitest?open=true')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          expect(res.body).to.be.an('array', 'is not an array');
          for(let i=0; i<res.body.length; i++){
            expect(res.body[i], `${res.body[i]} does not have property _id`).to.have.property('_id');
            expect(res.body[i], `${res.body[i]} does not have property issue_title`).to.have.property('issue_title');
            expect(res.body[i], `${res.body[i]} does not have property issue_text`).to.have.property('issue_text');
            expect(res.body[i], `${res.body[i]} does not have property created_on`).to.have.property('created_on');
            expect(res.body[i], `${res.body[i]} does not have property updated_on`).to.have.property('updated_on');
            expect(res.body[i], `${res.body[i]} does not have property created_by`).to.have.property('created_by');
            expect(res.body[i], `${res.body[i]} does not have property assigned_to`).to.have.property('assigned_to');
            expect(res.body[i], `${res.body[i]} does not have property open`).to.have.property('open');
            expect(res.body[i], `${res.body[i]} does not have property status_text`).to.have.property('status_text');
            assert.equal(res.body[i].open, true, 'open is not true');
          }
          done();
        });
    });
    //#6
    test('Test GET /api/issues/{project} with multiple filters', function (done) {
      chai
        .request(server)
        .get('/api/issues/apitest?open=true&created_by=Chai&assigned_to=margacampos')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          expect(res.body).to.be.an('array', 'is not an array');
          for(let i=0; i<res.body.length; i++){
            expect(res.body[i], `${res.body[i]} does not have property _id`).to.have.property('_id');
            expect(res.body[i], `${res.body[i]} does not have property issue_title`).to.have.property('issue_title');
            expect(res.body[i], `${res.body[i]} does not have property issue_text`).to.have.property('issue_text');
            expect(res.body[i], `${res.body[i]} does not have property created_on`).to.have.property('created_on');
            expect(res.body[i], `${res.body[i]} does not have property updated_on`).to.have.property('updated_on');
            expect(res.body[i], `${res.body[i]} does not have property created_by`).to.have.property('created_by');
            expect(res.body[i], `${res.body[i]} does not have property assigned_to`).to.have.property('assigned_to');
            expect(res.body[i], `${res.body[i]} does not have property open`).to.have.property('open');
            expect(res.body[i], `${res.body[i]} does not have property status_text`).to.have.property('status_text');
            assert.equal(res.body[i].open, true, 'open is not true');
            assert.equal(res.body[i].assigned_to, 'margacampos', 'assigned_to is not margacampos');
            assert.equal(res.body[i].created_by, 'Chai', 'created_by is not Chai');
          }
          done();
        });
    });
    // #7
    test('Test /api/issues/{project} update one field', function (done) {
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({_id: '621e2d30bc2a944af6388905', issue_text:"Just updated"})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body._id, '621e2d30bc2a944af6388905');
          assert.equal( res.body.result, 'successfully updated');
          done();
        });
    });
     // #8
    test('Test /api/issues/{project} update multiple fields', function (done) {
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({_id: '621e2d30bc2a944af6388905', open: false, issue_title:"apitest", created_by:"Chai"})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body._id, '621e2d30bc2a944af6388905');
          assert.equal( res.body.result, 'successfully updated');
          done();
        });
    });
    // #9
    test('Test /api/issues/{project} missing _id', function (done) {
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({ open: false, issue_title:"apitest", created_by:"Chai"})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal( res.body.error, 'missing _id');
          done();
        });
    });
    // #10
    test('Test /api/issues/{project} no fields to update', function (done) {
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({_id: '621e2d30bc2a944af6388905'})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body._id, '621e2d30bc2a944af6388905');
          assert.equal( res.body.error, 'no update field(s) sent');
          done();
        });
    });
    // #11
    test('Test /api/issues/{project} invalid _id', function (done) {
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({ _id: '21', open:true})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal( res.body.error,  'could not update');
          assert.equal( res.body._id,  '21');
          done();
        });
    });
    // #12
    test('Test /api/issues/{project} delete issue', function (done) {
      chai
        .request(server)
        .post('/api/issues/apitest')
        .send({
          issue_title: "apitest",
          issue_text: "Issue to delete",
          created_by: "Chai"
        })
        .end(function(error, response){
          chai
          .request(server)
          .delete('/api/issues/apitest')
          .send({ _id: response.body._id})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal( res.body.result,   'successfully deleted');
            assert.equal( res.body._id,  response.body._id);
            done();
          });
        })
        
    });
    // #13
    test('Test /api/issues/{project} delete with missing _id', function (done) {
      chai
        .request(server)
        .delete('/api/issues/apitest')
        .send({ })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal( res.body.error,   'missing _id');
          done();
        });
    });
     // #14
    test('Test /api/issues/{project} delete with invalid _id', function (done) {
      chai
        .request(server)
        .delete('/api/issues/apitest')
        .send({ _id: '62'})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal( res.body.error, 'could not delete');
          assert.equal( res.body._id,  '62');
          done();
        });
    });
  });
});
