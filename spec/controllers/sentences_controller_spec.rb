require 'rails_helper'

describe SentencesController do
	context 'POST create' do
    context "as authenticated user" do
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
      end

		  context "as author of story" do

				context "with valid params" do
				  it "adds a new sentence" do
				    expect{
				      post :create,
								:story_id => @story.id,
								:sentence => {
								  content: "Test sentence",
								  depth: 0,
								  position: 1,
								  parent_id: nil
								}
				    }.to change{ @story.sentences.count }.by(1)
				  end
				end

				context "with invalid params" do
				  it "doesn't add a new sentence" do
				    expect{
				      post :create,
								:story_id => @story.id,
								:sentence => {
								  content: "Test",
								  depth: nil,
								  position: 1,
								  parent_id: nil
								}
				    }.not_to change{ @story.sentences.count }
				  end
				end
		  end

		  context "not as author of story" do
				before do
				  @user2 = User.create(
				    username: "Tester2",
				    email: "test2@test2.com",
				    password: "password1"
				  )
				  sign_in @user2
				end

				it "does not add a new sentence" do
				  expect {
				    post :create,
				      :story_id => @story.id,
				      :sentence => {
								content: "Test sentence",
								depth: 0,
								position: 1,
								parent_id: nil
				      }
				  }.not_to change{ @story.sentences.count }
				end

				it "redirects to login" do
				  post :create,
				    :story_id => @story.id,
				    :sentence => {
				      content: "Test sentence",
				      depth: 0,
				      position: 1,
				      parent_id: nil
				    }
				  expect(response).to redirect_to(new_user_session_path)
				end
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
	    end

	    it "redirects to login" do
				post :create,
				  :story_id => @story.id,
				  :sentence => {
				    content: "Test sentence",
				    depth: 0,
				    position: 1,
				    parent_id: nil
				  }
				expect(response).to redirect_to(new_user_session_path)
	    end

    end
	end

  context 'PUT update' do
	before do
			@user = User.create(
			  username: "Tester",
			  email: "test@test.com",
			  password: "password1"
			)
			@story = @user.stories.create(
				name: "Test Story"
			)
			@sentence = @story.sentences.create(
				content: "Test sentence",
				depth: 0,
				position: 1,
				parent_id: nil
			)
    end

	context "when authenticated" do
		context "as story author" do
			before do
				sign_in @user
			end

			context "with valid params" do
				it "updates the sentence" do
					put :update,
						:story_id => @story.id,
						:id => @sentence.id,
						:sentence => {
						  content: "New Title",
						  depth: 0,
						  position: 1,
						  parent_id: nil
						}
					expect(Sentence.find(@sentence.id).content).to eq "New Title"
				end
			end

			context "with invalid params" do
				it "does not update the sentence" do
					put :update,
						:story_id => @story.id,
						:id => @sentence.id,
						:sentence => {
						  content: "New Title",
						  depth: 0,
						  position: nil,
						  parent_id: nil
						}
					expect(Sentence.find(@sentence.id).content).to eq "Test sentence"
				end
			end
		end

		context "not as story author" do
			before do
				@user2 = User.create(
				  username: "Tester2",
				  email: "test2@test2.com",
				  password: "password1"
				)
				sign_in @user2
			end
			it "redirects to login page" do
				put :update,
					:story_id => @story.id,
					:id => @sentence.id,
					:sentence => {
					  content: "Test sentence",
					  depth: 0,
					  position: nil,
					  parent_id: nil
					}
				expect(response).to redirect_to(new_user_session_path)
			end
		end
	end

	context "when unauthenticated" do
		it "redirects to login page" do
			put :update,
				:story_id => @story.id,
				:id => @sentence.id,
				:sentence => {
				  content: "Test sentence",
				  depth: 0,
				  position: 1,
				  parent_id: nil
				}
			expect(response).to redirect_to(new_user_session_path)
		end
	end
  end
end