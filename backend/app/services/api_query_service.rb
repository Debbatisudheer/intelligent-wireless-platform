class ApiQueryService
  def self.call(scope, params:)
    scope = apply_search(scope, params[:search])
    scope = apply_filters(scope, params)
    scope = apply_sort(scope, params[:sort])
    paginate(scope, params)
  end

  def self.apply_search(scope, search)
    return scope if search.blank?

    if scope.klass.column_names.include?("name")
      scope.where("name ILIKE ?", "%#{sanitize(search)}%")
    elsif scope.klass.column_names.include?("title")
      scope.where("title ILIKE ?", "%#{sanitize(search)}%")
    else
      scope
    end
  end

  def self.apply_filters(scope, params)
    params.each do |key, value|
      next if value.blank?
      next unless scope.klass.column_names.include?(key.to_s)

      scope = scope.where(key => value)
    end

    scope
  end

  def self.apply_sort(scope, sort)
    return scope.order(created_at: :desc) if sort.blank?

    direction = sort.to_s.start_with?("-") ? :desc : :asc
    column = sort.to_s.delete_prefix("-")

    return scope.order(created_at: direction) unless
      scope.klass.column_names.include?(column)

    scope.order(column => direction)
  end

  def self.paginate(scope, params)
    page = [ params[:page].to_i, 1 ].max
    per_page = params[:per_page].to_i

    per_page = 50 if per_page <= 0
    per_page = 100 if per_page > 100

    scope.offset((page - 1) * per_page).limit(per_page)
  end

  def self.sanitize(value)
    value.to_s.gsub("%", "\\%").gsub("_", "\\_")
  end

  private_class_method :apply_search,
                       :apply_filters,
                       :apply_sort,
                       :paginate,
                       :sanitize
end
