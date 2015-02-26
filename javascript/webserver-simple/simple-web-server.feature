Creating a WebServer using the State Pattern and the Revealing Module Pattern

Scenario: A stopped web server serving a request
    Given a web server is stopped
    When it serves a request
    Then it returns 503 Service Unavailable

Scenario: A started web server serving a request
    Given a web server is started
    When it serves a request
    Then it returns 200 OK

Scenario: Stopping a started web server
    Given a web server is started
    When it is stopped
    And it serves a request
    Then it returns 503 Service Unavaiable

Scenario: Starting a stopped web server
    Given a web server is stopped
    When it is started
    And it serves a request
    Then it returns 200 OK

Scenario: Stopping an already stopped web server
    Given a web server is stopped
    When it is stopped
    And it serves a request
    Then it returns 503 Service Unavailable

Scenario: Starting an already started web server
    Given a web server is started
    When it is started
    And it serves a request
    Then it returns 200 OK





