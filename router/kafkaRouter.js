import express from "express";
import sendMessageToKafka from "../controller/kafkaPublisherController.js";

const router = express.Router();
router.post("/", sendMessageToKafka);

export default router;
