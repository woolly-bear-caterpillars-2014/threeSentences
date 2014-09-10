module StoriesHelper
  def story_controls
    if ( params['controller'] == 'stories' &&
       ( params['action'] == 'show' ||
	 params['action'] == 'share') )
      render :partial => 'stories/story_nav'
    end
  end
end
