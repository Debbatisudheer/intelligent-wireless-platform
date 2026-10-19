require "rails_helper"

RSpec.describe AuditLog, type: :model do
  describe "model behavior" do
    it "is valid with no required attributes" do
      audit_log = AuditLog.new

      expect(audit_log).to be_valid
    end

    it "can be persisted" do
      audit_log = AuditLog.create!

      expect(audit_log).to be_persisted
    end
  end
end
