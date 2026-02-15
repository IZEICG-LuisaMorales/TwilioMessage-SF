public with sharing class TwilioController {
  private static final String ENDPOINT = 'https://sv-pruebas-9382-dev.twil.io/example';

  @AuraEnabled
  public static string getMessage(String name, Integer age) {
    try {
      Http http = new Http();
      HttpRequest request = new HttpRequest();

      request.setEndpoint(ENDPOINT);
      request.setMethod('POST');
      request.setHeader('Content-Type', 'application/json;charset=UTF-8');

      //validacion de parametros
      if (String.isNotBlank(name) || age > 0) {
        //construccion del body
        String body = TwilioController.createBody(name, age);
        request.setBody(body);
      }

      HttpResponse response = http.send(request);
      if (response.getStatusCode() == 200) {
        //obtener el mensaje de la respuesta de Twilio
        return TwilioController.getResponseMessage(response.getBody());
      } else {
        throw new CalloutException(
          'Twilio Error: ' + response.getStatus() + ' ' + response.getBody()
        );
      }
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  //construccion del body, dandole formato al nombre
  private static String createBody(String name, Integer age){
    String trimedName = name.trim();
    trimedName = trimedName.capitalize(); 
    TwilioPayload payload = new TwilioPayload(trimedName, age);
    return JSON.serialize(payload);
  }

  private static String getResponseMessage(String body){
    //obtener los elementos del body
    Map<String, Object> results = (Map<String, Object>) JSON.deserializeUntyped(body);

    //verificar si el mensaje se incluye en el body
    if (results.containsKey('message')) {
      return (String) results.get('message');
    } else {
      return 'No message received.';
    }
  }

  //clase para la serializacion del body
  public class TwilioPayload {
    public String name;
    public Integer age;

    public TwilioPayload(String name, Integer age) {
      this.name = name;
      this.age = age;
    }

    public TwilioPayload(String name) {
      this.name = name;
    }
  }
}
