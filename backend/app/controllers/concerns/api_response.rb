module ApiResponse
  extend ActiveSupport::Concern

  private

  def render_collection(records, serializer:)
    page = params[:page].to_i
    page = 1 if page <= 0

    per_page = params[:per_page].to_i
    per_page = 50 if per_page <= 0
    per_page = 100 if per_page > 100

    total = records.unscope(:limit, :offset).count

    render json: {
      data: records.map { |record| serializer.new(record).as_json },
      meta: {
        page: page,
        per_page: per_page,
        total: total,
        total_pages: (total.to_f / per_page).ceil
      }
    }
  end

  def render_resource(record, serializer:)
    render json: {
      data: serializer.new(record).as_json
    }
  end
end
