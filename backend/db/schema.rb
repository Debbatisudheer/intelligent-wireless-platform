# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_10_17_085840) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "access_points", force: :cascade do |t|
    t.bigint "site_id", null: false
    t.string "name"
    t.string "mac_address"
    t.string "ip_address"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["site_id"], name: "index_access_points_on_site_id"
  end

  create_table "alert_rules", force: :cascade do |t|
    t.bigint "site_id", null: false
    t.string "name"
    t.string "metric"
    t.string "operator"
    t.float "threshold"
    t.string "severity"
    t.boolean "enabled"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["site_id"], name: "index_alert_rules_on_site_id"
  end

  create_table "alerts", force: :cascade do |t|
    t.bigint "alert_rule_id", null: false
    t.bigint "site_id", null: false
    t.text "message"
    t.string "severity"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["alert_rule_id"], name: "index_alerts_on_alert_rule_id"
    t.index ["site_id"], name: "index_alerts_on_site_id"
  end

  create_table "audit_logs", force: :cascade do |t|
    t.bigint "user_id"
    t.string "action"
    t.string "resource_type"
    t.bigint "resource_id"
    t.jsonb "details"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "clients", force: :cascade do |t|
    t.bigint "site_id", null: false
    t.string "hostname"
    t.string "mac_address"
    t.string "ip_address"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["site_id"], name: "index_clients_on_site_id"
  end

  create_table "incidents", force: :cascade do |t|
    t.bigint "site_id", null: false
    t.string "title"
    t.text "description"
    t.string "severity"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["site_id"], name: "index_incidents_on_site_id"
  end

  create_table "organizations", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "radios", force: :cascade do |t|
    t.bigint "access_point_id", null: false
    t.string "band"
    t.integer "channel"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["access_point_id"], name: "index_radios_on_access_point_id"
  end

  create_table "sites", force: :cascade do |t|
    t.bigint "organization_id", null: false
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_sites_on_organization_id"
  end

  create_table "ssids", force: :cascade do |t|
    t.bigint "site_id", null: false
    t.string "name"
    t.string "security_type"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["site_id"], name: "index_ssids_on_site_id"
  end

  create_table "telemetry_records", force: :cascade do |t|
    t.bigint "radio_id", null: false
    t.float "rssi"
    t.float "snr"
    t.float "noise_floor"
    t.float "channel_utilization"
    t.float "packet_loss"
    t.float "latency"
    t.integer "connected_clients"
    t.float "traffic_mbps"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["radio_id"], name: "index_telemetry_records_on_radio_id"
  end

  add_foreign_key "access_points", "sites"
  add_foreign_key "alert_rules", "sites"
  add_foreign_key "alerts", "alert_rules"
  add_foreign_key "alerts", "sites"
  add_foreign_key "clients", "sites"
  add_foreign_key "incidents", "sites"
  add_foreign_key "radios", "access_points"
  add_foreign_key "sites", "organizations"
  add_foreign_key "ssids", "sites"
  add_foreign_key "telemetry_records", "radios"
end
