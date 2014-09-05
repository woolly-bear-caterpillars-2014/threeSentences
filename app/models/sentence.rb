class Sentence < ActiveRecord::Base
  has_many :children, class_name: "Sentence", foreign_key: "parent_id"

  belongs_to :parent, class_name: "Sentence"

  validates :depth, presence: true
  validates :story_id, presence: true
  validates :position, presence: true
end
