class CreateSentences < ActiveRecord::Migration
  def change
    create_table :sentences do |t|
      t.integer :parent_id
      t.integer :story_id
      t.text :content
      t.integer :depth

      t.timestamps
    end
  end
end
