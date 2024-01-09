
# typed: true
class BaseService
  rescue_from StandardError, with: :handle_internal_server_error

  def initialize(*_args); end

  def logger
    @logger ||= Rails.logger
  end

  private

  def log_error(error)
    logger.error(error.message)
    logger.error(error.backtrace.join("\n"))
  end

  def handle_internal_server_error(error)
    log_error(error)
    OpenStruct.new(success?: false, error: 'Internal server error', status: 500, message: 'Internal server error')
  end
end
