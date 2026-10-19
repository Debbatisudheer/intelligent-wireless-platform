class CreateTelemetryRecords < ActiveRecord::Migration[8.1]
  def change
    create_table :telemetry_records do |t|
      t.references :radio, null: false, foreign_key: true
      t.float :rssi
      t.float :snr
      t.float :noise_floor
      t.float :channel_utilization
      t.float :packet_loss
      t.float :latency
      t.integer :connected_clients
      t.float :traffic_mbps

      t.timestamps
    end
  end
end
