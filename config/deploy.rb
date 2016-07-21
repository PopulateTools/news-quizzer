lock '3.5.0'

set :user, 'africaoffshoregame'
set :application, 'icij-africa-game'
set :deploy_to, "/var/www/#{fetch(:application)}"
set :repo_url, 'git@github.com:PopulateTools/icij-africa-game.git'
set :linked_files, fetch(:linked_files, []).push('config/secrets.yml', 'config/database.yml', 'config/settings.yml')
set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', 'public/system')
set :rbenv_type, :system
set :rbenv_ruby, '2.3.1'
set :rbenv_path, "/usr/local/rbenv"
set :delayed_job_workers, 1
set :passenger_restart_with_touch, true
