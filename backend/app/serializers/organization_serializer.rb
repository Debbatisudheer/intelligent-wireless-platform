class OrganizationSerializer
  def initialize(organization)
    @organization = organization
  end

  def as_json
    {
      id: @organization.id,
      name: @organization.name,
      created_at: @organization.created_at,
      updated_at: @organization.updated_at
    }
  end
end
