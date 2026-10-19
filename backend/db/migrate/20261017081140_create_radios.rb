class CreateRadios < ActiveRecord::Migration[8.1]
  def change
    create_table :radios do |t|
      t.references :access_point, null: false, foreign_key: true
      t.string :band
      t.integer :channel
      t.string :status

      t.timestamps
    end
  end
end
