import Express from "express";
import fs from "node:fs";
import path from "path";
import URL from "url";

import { config } from "../config";
import { AvsEncryption } from "../lib/encryption";
import { AvsResponse } from "../lib/response";
import { AvsStorageSession } from "../storage/session";

export function load(app: Express.Application) {
  app.use(
    (
      req: Express.Request,
      res: Express.Response,
      next: Express.NextFunction
    ) => {
      next();
    }
  );

  app.get("/", (req: Express.Request, res: Express.Response) => {
    res.render("home/index.twig", {
      js: {
        onDocumentReady: "AvsHome.main",
      },
    });
  });

  app.post(
    "/getVerificationPayloadAndUrl",
    (req: Express.Request, res: Express.Response) => {
      const colorConfigBodyBackgroundInput =
        req.body["colorConfigBodyBackgroundInput"];
      const colorConfigBodyForegroundInput =
        req.body["colorConfigBodyForegroundInput"];
      const colorConfigButtonBackgroundInput =
        req.body["colorConfigButtonBackgroundInput"];
      const colorConfigButtonForegroundInput =
        req.body["colorConfigButtonForegroundInput"];
      const colorConfigButtonForegroundCTAInput =
        req.body["colorConfigButtonForegroundCTAInput"];
      const callbackUrl = req.body["callbackUrl"];

      if (
        colorConfigBodyBackgroundInput == undefined ||
        colorConfigBodyForegroundInput == undefined ||
        colorConfigButtonBackgroundInput == undefined ||
        colorConfigButtonForegroundInput == undefined ||
        colorConfigButtonForegroundCTAInput == undefined ||
        callbackUrl == undefined
      ) {
        res.send(AvsResponse.errorResponse(30000, "Invalid payload config"));
        return;
      }

      const userAgent = req.headers["user-agent"];
      const linkBack = "/";
      const userIpCountry = "US";
      const userIpState = "TX";
      const creationTimestamp = +new Date();
      const testPathRedirect = "/token";
      const testPathIframe = "/token/iframeCheck";

      const requestPayload = AvsEncryption.encryptObject({
        userData: {
          userId: 0,
          colorConfig: {
            body: {
              background: colorConfigBodyBackgroundInput,
              foreground: colorConfigBodyForegroundInput,
              button: {
                background: colorConfigButtonBackgroundInput,
                foreground: colorConfigButtonForegroundInput,
                foregroundCallToAction: colorConfigButtonForegroundCTAInput,
              },
            },
          },
        },
        httpUserAgent: userAgent,
        websiteHostname: config.httpServerHost,
        httpParamList: {
          userAgent: userAgent,
          websiteHostname: config.httpServerHost,
          paramList: {
            showDetectedAgeNumber: true,
          },
        },
        verificationVersion: AvsStorageSession.VERIFICATION_IFRAME_V1,
        linkBack: linkBack,
        userIpCountry: userIpCountry,
        userIpState: userIpState,
        userIpStr: req.ip,
        callbackUrl: callbackUrl,
        creationTimestamp: creationTimestamp,
      });

      const urlToken = {
        protocol: config.httpServerProtocol,
        hostname: config.httpServerHost,
        port: config.httpServerPort,
        pathname: testPathRedirect,
        query: {
          d: requestPayload,
        },
      };
      const urlTokenString = URL.format(urlToken);

      const urlIframe = {
        protocol: config.httpServerProtocol,
        hostname: config.httpServerHost,
        port: config.httpServerPort,
        pathname: testPathIframe,
        query: {
          d: requestPayload,
        },
      };
      const urlIframeString = URL.format(urlIframe);

      res.send(
        AvsResponse.successResponse({
          payload: requestPayload,
          url: urlTokenString,
          iframeUrl: urlIframeString,
        })
      );
    }
  );

  app.post(
    "/validateVerificationPayload",
    (req: Express.Request, res: Express.Response) => {
      const verificationPayload = req.body.verificationPayload;

      if (typeof verificationPayload == "undefined") {
        res.send(AvsResponse.errorResponse(30001, "Invalid payload"));
        return;
      }

      const payloadParsed = AvsEncryption.decryptString(verificationPayload);
      if (typeof payloadParsed.verificationResult == "undefined") {
        res.send(
          AvsResponse.errorResponse(
            30002,
            "Verification payload integrity check failed"
          )
        );
        return;
      }

      if (
        payloadParsed.verificationResult.stateInt !=
        AvsStorageSession.SESSION_STATE_SUCCESS
      ) {
        res.send(AvsResponse.errorResponse(30003, "Payload state invalid"));
        return;
      }

      res.send(
        AvsResponse.successResponse({
          sessionId: payloadParsed.verificationResult.sessionId,
        })
      );
    }
  );

  app.post("/callback", (req: Express.Request, res: Express.Response) => {
    const responseString = JSON.stringify(req.body) + "\n";
    fs.appendFile(
      path.join(__dirname, "./../../../log/callback.log"),
      responseString,
      (err: unknown) => {
        if (err) {
          res.send(
            AvsResponse.errorResponse(
              30004,
              "Callback file log error: " + err.toString()
            )
          );
          return;
        } else {
          res.send(AvsResponse.successResponse());
          return;
        }
      }
    );
  });

  app.get("/test", (req: Express.Request, res: Express.Response) => {
    res.send("test");
  });

  app.all("*", (req: Express.Request, res: Express.Response) => {
    res.send("404");
  });
}

export default { load };
