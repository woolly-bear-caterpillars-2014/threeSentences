require 'rails_helper'

describe StoriesController do
  context "GET index" do
    context "as authenticated user" do
      before do
	@user = User.create(
	  username: "Tester",
	  email: "test@test.com",
	  password: "password1"
	)
	sign_in @user
	get :index
      end

      it "assigns all user's stories to a variable" do
	expect(assigns(:stories)).to be
      end
    end

    context "when unauthenticated" do
      before do
	sign_out :user
	get :index
      end

      it "redirects to login" do
	expect(response).to redirect_to(new_user_session_path)
      end
    end
  end
end
