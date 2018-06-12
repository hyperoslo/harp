var should      = require("should")
var request     = require("request")
var path        = require("path")
var fs          = require("fs")
var exec        = require("child_process").exec
var harp        = require("../")

describe("dynamic", function(){
  var projectPath = path.join(__dirname, "apps/dynamic")
  var outputPath  = path.join(__dirname, "out/dynamic")
  var config;

  before(function(done){
    harp.compile(projectPath, outputPath, function(errors, output){
      config = output
      harp.server(projectPath, { port: 8105 }, done)
    })
  })

  it("should read dynamic config", function(done){
    request('http://localhost:8105/globals.json', function (e, r, b) {
      r.statusCode.should.eql(200)
      var globals = JSON.parse(b)
      globals.should.have.property("static", "static")
      globals.should.have.property("dynamic", "dynamic")
      done()
    })
  })

  after(function(done){
    exec("rm -rf " + outputPath, function(){
      done()
    })
  })
})
