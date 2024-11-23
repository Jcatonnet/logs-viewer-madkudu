-- CreateIndex
CREATE INDEX "LogEvent_timestamp_idx" ON "LogEvent"("timestamp");

-- CreateIndex
CREATE INDEX "LogEvent_service_idx" ON "LogEvent"("service");

-- CreateIndex
CREATE INDEX "LogEvent_level_idx" ON "LogEvent"("level");
