organization = Organization.find_or_create_by!(
  name: "Demo Organization"
)

site = Site.find_or_create_by!(
  organization: organization,
  name: "Hyderabad Office"
)

access_point = AccessPoint.find_or_create_by!(
  site: site,
  name: "Hyderabad-AP-01"
) do |ap|
  ap.mac_address = "AA:BB:CC:DD:EE:01"
  ap.ip_address = "192.168.1.20"
  ap.status = "online"
end

radio = Radio.find_or_create_by!(
  access_point: access_point,
  band: "5GHz"
) do |r|
  r.channel = 36
  r.status = "online"
end

Ssid.find_or_create_by!(
  site: site,
  name: "Corporate-WiFi"
) do |ssid|
  ssid.security_type = "WPA3"
  ssid.status = "active"
end

telemetry_samples = [
  [-52, 38, -90, 24, 0.4, 8, 12, 48.5],
  [-55, 35, -90, 29, 0.7, 10, 14, 55.2],
  [-50, 40, -90, 21, 0.2, 7, 10, 42.8],
  [-58, 32, -89, 35, 1.1, 13, 18, 67.4],
  [-54, 36, -90, 27, 0.5, 9, 15, 58.1],
  [-51, 39, -91, 23, 0.3, 8, 11, 46.7],
  [-60, 30, -89, 41, 1.4, 16, 21, 74.3],
  [-56, 34, -90, 31, 0.8, 11, 16, 61.9],
  [-53, 37, -91, 26, 0.4, 9, 13, 51.6],
  [-57, 33, -90, 34, 0.9, 12, 17, 64.2]
]

telemetry_samples.each do |rssi, snr, noise_floor, channel_utilization,
                           packet_loss, latency, connected_clients, traffic_mbps|
  TelemetryRecord.find_or_create_by!(
    radio: radio,
    rssi: rssi,
    snr: snr,
    noise_floor: noise_floor,
    channel_utilization: channel_utilization,
    packet_loss: packet_loss,
    latency: latency,
    connected_clients: connected_clients,
    traffic_mbps: traffic_mbps
  )
end

puts "Wireless demo data seeded successfully."
puts "Organizations: #{Organization.count}"
puts "Sites: #{Site.count}"
puts "Access Points: #{AccessPoint.count}"
puts "Radios: #{Radio.count}"
puts "SSIDs: #{Ssid.count}"
puts "Telemetry Records: #{TelemetryRecord.count}"