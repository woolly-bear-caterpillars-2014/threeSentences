module StoriesHelper
  def story_controls
    if ( params['controller'] == 'stories' &&
       ( params['action'] == 'show' ||
	 params['action'] == 'share' || params['action'] == 'demo') )
      render :partial => 'stories/story_nav'
    end
  end

  def shorten_title(title)
    if title.length > 10
      new_title = title[0..9]
      new_title += "..."
      return new_title
    else
      return title
    end
  end

end
