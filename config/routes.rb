Rails.application.routes.draw do

  resources :stories do
    resources :sentences, only: [:create, :update]
  end

  root "welcome#index"

  devise_for :users, :controllers => { registrations: 'registrations' }

  post 'stories/:id/export' => 'stories#export', as: :story_export

  get '/download/:file.:filetype' => 'stories#download'

end
