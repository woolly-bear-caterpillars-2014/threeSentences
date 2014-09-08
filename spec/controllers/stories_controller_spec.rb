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


  context "GET show" do
    context "when authenticated as story's author" do
      before do
	@user = User.create(
	  username: "Tester",
	  email: "test@test.com",
	  password: "password1"
	)
	@story = @user.stories.create(
	  name: "Test Story"
	)
	sign_in @user
	get :show, id: @story.id
      end

      it "assigns story to a variable" do
	expect(assigns(:story)).to be
      end

      it "assigns an empty sentence to a new variable" do
	expect(assigns(:sentence)).to be
      end
    end

    context "when authenticated as non-author" do
      before do
	@user = User.create(
	  username: "Tester",
	  email: "test@test.com",
	  password: "password1"
	)
	@story = @user.stories.create(
	  name: "Test Story"
	)
	@user2 = User.create(
	  username: "Tester2",
	  email: "test2@test2.com",
	  password: "password1"
	)
	sign_in @user2
	get :show, id: @story.id
      end

      it "redirects to login" do
	expect(response).to redirect_to(new_user_session_path)
      end
    end

    context "when unauthenticated" do
      before do
	@user = User.create(
	  username: "Tester",
	  email: "test@test.com",
	  password: "password1"
	)
	@story = @user.stories.create(
	  name: "Test Story"
	)
	sign_out @user
	get :show, id: @story.id
      end

      it "redirects to login" do
	expect(response).to redirect_to(new_user_session_path)
      end
    end
  end

  context "GET new" do
    before do
      @user = User.create(
	username: "Tester",
	email: "test@test.com",
	password: "password1"
      )
      sign_in @user
      get :new
    end

    it "assigns a new story to a variable" do
      expect(assigns(:story)).to be
    end
  end

  context "POST create" do
    context "with valid params" do
      before do
	@user = User.create(
	  username: "Tester",
	  email: "test@test.com",
	  password: "password1"
	)
	@story = @user.stories.build(
	  name: "Test Story"
	)
	sign_in @user
      end

      it "creates a new story" do
	expect{
	  post :create, :story => {
	    name: @story.name,
	    user_id: @user.id
	  }
	}.to change{@user.stories.count}.by(1)
      end
    end

    context "with invalid params" do
      before do
	@user = User.create(
	  username: "Tester",
	  email: "test@test.com",
	  password: "password1"
	)
	sign_in @user
      end

      it "does not create a new story" do
	expect{
	  post :create, :story => {
	    name: '',
	    user_id: @user.id
	  }
	}.not_to change{ @user.stories.count }
      end
    end
  end

  context "DELETE destroy" do
    context "when authenticated" do
      before do
	@user = User.create(
	  username: "Tester",
	  email: "test@test.com",
	  password: "password1"
	)
	@story = @user.stories.create(
	  name: "Test Story"
	)
      end

      context "as resource owner" do
	it "deletes story" do
	  sign_in @user
	  expect {
	    delete :destroy, id: @story.id
	  }.to change{ @user.stories.count }.by(-1)
	end
      end

      context "as unauthorized user" do
	before do
	  @user2 = User.create(
	    username: "Tester2",
	    email: "test2@test2.com",
	    password: "password1"
	  )
	  sign_in @user2
	end
	it "does not delete story" do
	  expect {
	    delete :destroy, id: @story.id
	  }.not_to change{ @user.stories.count }
	end
      end
    end

    context "when unauthenticated" do
      it "redirects to login page" do
	@user = User.create(
	  username: "Tester",
	  email: "test@test.com",
	  password: "password1"
	)
	@story = @user.stories.create(
	  name: "Test Story"
	)
	delete :destroy, id: @story.id
	expect(response).to redirect_to(new_user_session_path)
      end
    end
  end

  context "POST export" do
    pending "determine how to test file creation"
  end

  context "GET download" do
    pending "determine how to test file download"
  end

end
