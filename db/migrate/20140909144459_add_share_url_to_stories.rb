class AddShareUrlToStories < ActiveRecord::Migration
  def change
    add_column :stories, :share_url, :string
  end
end
