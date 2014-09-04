class CreateSentences < ActiveRecord::Migration
  def change
    create_table :sentences do |t|

      t.timestamps
    end
  end
end
