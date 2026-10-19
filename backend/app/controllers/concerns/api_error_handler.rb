module ApiErrorHandler
  extend ActiveSupport::Concern

  included do
    rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
    rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity
    rescue_from ActionController::ParameterMissing, with: :render_bad_request
  end

  private

  def render_not_found(error)
    render json: {
      error: {
        code: "NOT_FOUND",
        message: error.message
      }
    }, status: :not_found
  end

  def render_unprocessable_entity(error)
    render json: {
      error: {
        code: "VALIDATION_ERROR",
        message: error.message,
        details: error.record.errors.full_messages
      }
    }, status: :unprocessable_entity
  end

  def render_bad_request(error)
    render json: {
      error: {
        code: "BAD_REQUEST",
        message: error.message
      }
    }, status: :bad_request
  end
end
