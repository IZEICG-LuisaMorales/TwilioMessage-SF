@isTest
global class TwilioMock implements HttpCalloutMock {
  global HTTPResponse respond(HTTPRequest request) {
    HttpResponse response = new HttpResponse();
    response.setHeader('Content-Type', 'application/json');
    String requestBody = request.getBody();

    if (String.isBlank(requestBody)) {
      response.setStatusCode(400);
      response.setBody('{"error":"No information provided"}');
      return response;
    }
    Map<String, Object> body = (Map<String, Object>) JSON.deserializeUntyped(
      requestBody
    );
    if (!body.containsKey('name')) {
      response.setStatusCode(400);
      response.setBody('{"error":"The name is required"}');
      return response;
    }
    String name = (String) body.get('name');

    Integer age;
    if (body.containsKey('age')) {
      age = (Integer) body.get('age');
    }

    response.setStatusCode(200);
    String msj;

    if (age != null) {
      Integer plusAge = Integer.valueOf(age) + 1;
      msj =
        'Hola, ' +
        name +
        ', te recuerdo que ya casi tienes ' +
        plusAge +
        ' anios';
    } else {
      msj = 'Hola, ' + name;
    }
    response.setBody('{"message":"' + msj + '"}');
    return response;
  }
}
