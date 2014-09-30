class Story < ActiveRecord::Base
  require 'export'
  include Export

  belongs_to :user
  has_many :sentences

  validates :name, presence: true
  before_create :generate_share_url

  def short_title
    if name.length > 40
      return name[0..39] + "..."
    else
      return name
    end
  end

  private

  def generate_share_url
    self.share_url = Digest::SHA1.hexdigest(rand(1_000_000).to_s)[0..6]
  end

end
