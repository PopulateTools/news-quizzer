source 'https://rubygems.org'

gem 'rails', '>= 5.0.0', '< 5.1'
gem 'mysql2'
gem 'uglifier'
gem 'rollbar'
gem 'countries'
gem 'meta-tags'
gem 'config'
# We use a custom version of this gem, to detect not only complete words
# but substrings inside a word
gem 'obscenity', path: 'vendor/obscenity'

# Frontend
gem 'jquery-rails'
gem 'sass-rails'
gem 'bourbon'
gem 'therubyracer', platforms: :ruby
gem 'flight-for-rails'

group :development, :test do
  gem 'byebug', platform: :mri
  gem 'spring'
  gem 'listen', '~> 3.0.5'
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'spring-commands-rspec'
end

group :test do
  gem 'database_cleaner'
  gem 'rspec-rails'
  gem 'capybara'
  gem 'launchy'
  gem 'selenium-webdriver'
end

group :development do
  gem 'web-console'
  gem 'capistrano'
  gem 'capistrano-rbenv'
  gem 'capistrano-bundler'
  gem 'capistrano-rails'
  gem 'capistrano-passenger'
  gem 'capistrano-rails-console'
  gem 'capistrano-rails-log'
  gem 'puma', '~> 3.0'
end
