Rails.application.routes.draw do
  root to: 'screens#show'

  post "start" => "screens#show"

  resources :answers, only: [:create]
  resources :sessions, only: [:create]
  resource :session, only: [:update, :destroy]

  get "pages/:page" => "pages#show"
  get "embed.js" => "embed#show"

  if Rails.env.development? || Rails.env.staging?
    get 'sandbox' => 'sandbox#index', as: :sandbox
    get 'sandbox/:slug' => 'sandbox#show', as: :sandbox_screen
  end

end
