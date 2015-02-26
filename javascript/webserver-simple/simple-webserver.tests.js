describe("Web Server", function() {

    describe("Given a web server is stopped", function() {
        describe("When it serves a request", function() {
            it("it returns 503 Service Unavailable");
        });
        describe("when it is started", function() {
            describe("And it serves a request", function() {
                it("Then it returns 200 OK");
            });
        });
        describe("When it is stopped", function() {
            describe("And it serves a request", function() {
                it("it returns 503 Service Unavailable")
            });
        });
    });

    describe("Given a web server is started", function() {
        describe("When it serves a request", function() {
            it("Then it returns 200 OK");
        });

        describe("Given it is stopped", function() {
            describe("When it serves a request", function() {
                it("Then it returns 503 Service Unavailable");
            });
        });

        describe("When it is started", function(){
            describe("And it serves a request", function(){
                it("Then it returns 200 OK");
            });
        });
    });
});
