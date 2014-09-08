Rails.application.routes.draw do

  mount JasmineRails::Engine => '/specs' if defined?(JasmineRails)
  resources :stories do
    resources :sentences, only: [:create, :update]
  end

  root "welcome#index"

  devise_for :users, :controllers => { registrations: 'registrations' }

  post 'stories/:id/export' => 'stories#export', as: :story_export

  get '/download/:file.:filetype' => 'stories#download'

  delete '/download/:file.:filetype' => 'stories#delete_export'


end
