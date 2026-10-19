class CreateAlertRules < ActiveRecord::Migration[8.1]
  def change
    create_table :alert_rules do |t|
      t.references :site, null: false, foreign_key: true
      t.string :name
      t.string :metric
      t.string :operator
      t.float :threshold
      t.string :severity
      t.boolean :enabled

      t.timestamps
    end
  end
end
