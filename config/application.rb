require_relative 'boot'

require "rails"
require "active_model/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_view/railtie"
require "active_job/railtie"
require "sprockets/railtie"

Bundler.require(*Rails.groups)

module IcijAfricaGame
  class Application < Rails::Application
    config.time_zone = 'UTC'

    config.i18n.load_path += Dir[Rails.root.join('config', 'locales', '**', '*.{rb,yml}').to_s]
    config.i18n.default_locale = :en
    config.i18n.available_locales = [:en]

    config.active_record.raise_in_transactional_callbacks = true

    config.generators do |g|
      g.orm             :active_record
      g.template_engine :erb
      g.assets          false
      g.helper          false
      g.routes          false
      g.test_framework  :rspec, fixtures: false, view_spec: false,
        helper_specs: false, routing_specs: false,
        controller_specs: false, request_specs: false
    end

    # Autoloading
    config.autoload_paths += [
      "#{config.root}/lib",
      "#{config.root}/app/models/question"
    ]

    # Allow embeds
    config.action_dispatch.default_headers = {
      'X-Frame-Options' => 'ALLOWALL'
    }

    # Disable automatic disable with buttons on submit
    config.action_view.automatically_disable_submit_tag = false

    config.active_job.queue_adapter = :delayed_job
  end
end
