class SentencesController < ApplicationController
  before_action :authenticate_user!
  before_action :get_story
  before_action :verify_author

  def create
    @sentence = @story.sentences.build(sentence_params)
    if @sentence.save
      render json: @sentence.to_json
    else
      render json: @sentence.errors.full_messages.to_json
    end
  end

  def update
    @sentence = Sentence.find(params[:id])

    if @sentence.update(sentence_params)
      render json: @sentence.to_json
    else
      render json: @sentence.errors.full_messages.to_json
    end
  end

  private

  def sentence_params
    params.require(:sentence).permit(:id, :depth, :position, :content, :parent_id)
  end

  def get_story
    @story = Story.find(params[:story_id])
  end
end
