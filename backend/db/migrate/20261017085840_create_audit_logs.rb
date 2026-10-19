class CreateAuditLogs < ActiveRecord::Migration[8.1]
  def change
    create_table :audit_logs do |t|
      t.bigint :user_id
      t.string :action
      t.string :resource_type
      t.bigint :resource_id
      t.jsonb :details

      t.timestamps
    end
  end
end
