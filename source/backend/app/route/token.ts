import Express from "express";
import uaParser from "ua-parser-js";

import { config } from "../config";
import { AvsEncryption } from "../lib/encryption";
import { AvsRandom } from "../lib/random";
import { AvsStorageSession } from "../storage/session";

const ROUTE_ROOT = "/token";

export function load(app: Express.Application, storage: AvsStorageSession) {
  app.get(ROUTE_ROOT, (req: Express.Request, res: Express.Response) => {
    return renderTokenPage(
      req,
      res,
      AvsStorageSession.VERIFICATION_STANDARD_V1
    );
  });

  app.get(
    ROUTE_ROOT + "/iframeRender",
    (req: Express.Request, res: Express.Response) => {
      return renderTokenPage(
        req,
        res,
        AvsStorageSession.VERIFICATION_IFRAME_V1
      );
    }
  );

  app.get(
    ROUTE_ROOT + "/iframeCheck",
    (req: Express.Request, res: Express.Response) => {
      const isAgeVerified = typeof req.cookies["isAgeVerified"] != "undefined";
      let verificationPayload = null;

      if (isAgeVerified) {
        verificationPayload = req.cookies["isAgeVerified"];
      }

      res.render("token/embedCheck.twig", {
        js: {
          isAgeVerified: isAgeVerified,
          verificationPayload: verificationPayload,
        },
      });
    }
  );

  const renderTokenPage = (
    req: Express.Request,
    res: Express.Response,
    verificationVersion: number = 1
  ) => {
    const payload = req.query["d"];
    if (typeof payload == "undefined") {
      res.render("token/error.twig", {
        code: 30005,
        msg: "Invalid payload",
      });
      return;
    }

    let avsSession = null;
    try {
      avsSession = storage.start(payload.toString());
    } catch (e) {
      console.log(e);
    }

    if (avsSession == null) {
      res.render("token/error.twig", {
        code: 30006,
        msg: "Invalid payload",
      });
      return;
    }

    const payloadParsed = payload
      ? AvsEncryption.decryptString(payload.toString())
      : null;
    const successKey = AvsRandom.generateRandomString(32);
    const failKey = AvsRandom.generateRandomString(32);

    const sessionId = req.session.id;
    const ipCountry = "FR";

    req.session.successKey = successKey;
    req.session.failKey = failKey;
    req.session.accessTime = +new Date();
    req.session.sessionStartId = avsSession.sessionId;
    req.session.payload = payload;

    const userAgent =
      typeof req.headers["user-agent"] != "undefined"
        ? uaParser(req.headers["user-agent"])
        : "";

    res.render("token/index.twig", {
      js: {
        onDocumentReady: "AvsToken.main",
        token: AvsEncryption.base64EncodeObject({
          successKey: successKey,
          failKey: failKey,
          backLink: avsSession.linkBack,
        }),
        isLiveness: true,
        showDetectedAgeNumber: false,
        verificationVersion: verificationVersion,
        d: payload,
        sessionId: sessionId,
        partnerColorConfig: payloadParsed["userData"]["colorConfig"],
        ipCountry: ipCountry,
        deviceInfo: userAgent,
        countryAgeMajority: config.countryAgeMajority,
      },
      debug: config.enableFrontEndDebug,
    });
  };
}

export default { load };
