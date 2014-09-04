class Sentence < ActiveRecord::Base
  has_many :children, class_name: "Sentence", foreign_key: "parent_id"

  belongs_to :parent, class_name: "Sentence"
end
