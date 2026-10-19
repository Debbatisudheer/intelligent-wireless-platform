class SiteSerializer
  def initialize(site)
    @site = site
  end

  def as_json
    {
      id: @site.id,
      organization_id: @site.organization_id,
      name: @site.name,
      created_at: @site.created_at,
      updated_at: @site.updated_at
    }
  end
end
