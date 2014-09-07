class Story < ActiveRecord::Base
  belongs_to :user
  has_many :sentences

  validates :name, presence: true


  def export_story(depth, filetype)
    self.generate_markdown(depth, filetype)
  end

  def depth_start_position(depth)
    position = 1
    depth.times do |i|
      position += 3 ** (i + 1)
    end
    position
  end

  def depth_end_position(depth)
    depth_start_position(depth) + 3 ** (depth + 1) - 1
  end

  def get_headers(depth)
    positions = (self.depth_start_position(depth)..self.depth_end_position(depth)).to_a
    positions.map {|position| Sentence.find_by_position(position)}
  end

  def generate_markdown(depth, filetype)
    self.export(get_content(depth), filetype)
  end

  def get_content(depth)
    md_content = ""
    md_content += create_title

    if depth == 0
      headers = get_headers(depth)
      headers.each do |header|
        md_content += create_header(header)
      end
    else
      headers = get_headers(depth - 1)
      p headers
      headers.each do |header|
        p md_content += create_header(header)
        header.children.each do |child|
         md_content += create_text(child)
        end
        md_content += "\n"
      end
    end
    md_content
  end


  def create_title
    "# #{self.name}\n\n"
  end

  def create_header(header, level = 2)
    "#{'#' * level} #{header.content}\n\n"
  end

  def create_text(child)
    "#{child.content}\n"
  end


  def export(content, filetype)
    a = Docverter::Conversion.run("markdown", filetype, content)
    File.open('test.rtf', 'w') { |file| file.write(a) }

  end

end
