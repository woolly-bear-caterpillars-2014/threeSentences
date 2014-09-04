class AddPositionToSentences < ActiveRecord::Migration
  def change
    add_column :sentences, :position, :integer
  end
end
