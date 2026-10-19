class TelemetryChannel < ApplicationCable::Channel
  def subscribed
    stream_from "telemetry"
  end

  def unsubscribed
    stop_all_streams
  end
end
