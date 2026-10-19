class CreateSsids < ActiveRecord::Migration[8.1]
  def change
    create_table :ssids do |t|
      t.references :site, null: false, foreign_key: true
      t.string :name
      t.string :security_type
      t.string :status

      t.timestamps
    end
  end
end
