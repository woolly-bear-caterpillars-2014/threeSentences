class RegistrationsController < Devise::RegistrationsController
  protected

  def after_sign_up_path_for(resource)
    stories_demo_path
  end


  private

  def sign_up_params
    params.require(:user).permit(:username, :email, :password, :password_confirmation)
  end

  def account_update_params
    params.require(:user).permit(:username, :email, :password, :password_confirmation, :current_password)
  end
end
