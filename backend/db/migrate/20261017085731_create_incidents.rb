class CreateIncidents < ActiveRecord::Migration[8.1]
  def change
    create_table :incidents do |t|
      t.references :site, null: false, foreign_key: true
      t.string :title
      t.text :description
      t.string :severity
      t.string :status

      t.timestamps
    end
  end
end
