Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :organizations, only: [ :index ]
      resources :sites, only: [ :index ]
      resources :access_points, only: [ :index ]
      resources :radios, only: [ :index ]

      resources :telemetry_records, only: [ :index ] do
        member do
          get :analytics
        end
      end

      resources :ssids, only: [ :index ]
      resources :clients, only: [ :index ]
      resources :alert_rules, only: [ :index ]
      resources :alerts, only: [ :index ]
      resources :incidents, only: [ :index ]
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check

  mount ActionCable.server => "/cable"
end
