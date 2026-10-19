class CreateAlerts < ActiveRecord::Migration[8.1]
  def change
    create_table :alerts do |t|
      t.references :alert_rule, null: false, foreign_key: true
      t.references :site, null: false, foreign_key: true
      t.text :message
      t.string :severity
      t.string :status

      t.timestamps
    end
  end
end
