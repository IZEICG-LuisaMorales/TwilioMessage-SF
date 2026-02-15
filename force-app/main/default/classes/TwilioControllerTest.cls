/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an org are executed whenever Apex code is deployed
 * to a production org to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production org. In addition, all triggers must have some code coverage.
 *
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the org size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@isTest
private class TwilioControllerTest {
  //test para validar el mensaje de respuesta de Twilio con solo el nombre
  @isTest
  static void testGreeting() {
    Test.setMock(HttpCalloutMock.class, new TwilioMock());

    Test.startTest();
    String response = TwilioController.getMessage('Luisa', 0);
    Test.stopTest();

    Assert.areEqual(
      'Hola, Luisa',
      response,
      'El mensaje recibido no es el esperado'
    );
  }

  //test para validar el mensaje de respuesta de Twilio con el nombre y la edad
  @isTest
  static void testGreetingWithAge() {
    Test.setMock(HttpCalloutMock.class, new TwilioMock());

    Test.startTest();
    String response = TwilioController.getMessage('Luisa', 20);
    Test.stopTest();

    Assert.areEqual(
      'Hola, Luisa, te recuerdo que ya casi tienes 21 años!',
      response,
      'El mensaje recibido no es el esperado'
    );
  }

  //test para validar el mensaje de respuesta de Twilio sin nombre ni edad
  @isTest
  static void testGreetingWithoutName() {
    Test.setMock(HttpCalloutMock.class, new TwilioMock());

    Test.startTest();

    try {
      TwilioController.getMessage('',0);
      Assert.fail('An AuraHandledException was expected');
    } catch (Exception e) {
      Assert.isInstanceOfType(
        e,
        AuraHandledException.class,
        'Exception must be AuraHandledException'
      );
    }

    Test.stopTest();
  }

  //test para validar el mensaje de respuesta de Twilio con solo la edad
  @isTest
  static void testGreetingJustWithAge() {
    Test.setMock(HttpCalloutMock.class, new TwilioMock());

    Test.startTest();

    try {
      TwilioController.getMessage('',20);
      Assert.fail('An AuraHandledException was expected');
    } catch (Exception e) {
      Assert.isInstanceOfType(
        e,
        AuraHandledException.class,
        'Exception must be AuraHandledException'
      );
    }

    Test.stopTest();
  }
}
