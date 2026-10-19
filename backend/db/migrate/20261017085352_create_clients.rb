class CreateClients < ActiveRecord::Migration[8.1]
  def change
    create_table :clients do |t|
      t.references :site, null: false, foreign_key: true
      t.string :hostname
      t.string :mac_address
      t.string :ip_address
      t.string :status

      t.timestamps
    end
  end
end
