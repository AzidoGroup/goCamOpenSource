function appGetInternalState() {

  const verificationStepGlobal = Avs.Entity.VerificationStepGlobal.getInstance();
  const selfieAgeDetection     = Avs.Entity.SelfieAgeDetection.getInstance();
  const scanIdAgeVerification  = Avs.Entity.ScanIdAgeVerification.getInstance();


  return {
    verificationStepGlobal: verificationStepGlobal,
    selfieAgeDetection    : selfieAgeDetection,
    scanIdAgeVerification : scanIdAgeVerification,

  };

}
