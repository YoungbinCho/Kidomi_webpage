import os
from importlib import import_module
from flask import Flask, render_template, Response, Request

# flask --app kidomi --debug run

# import camera driver


def create_app(test_config=None):
    """Create and configure an instance of the Flask application."""
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        # a default secret that should be overridden by instance config
        SECRET_KEY="dev",
        # store the database in the instance folder
        DATABASE=os.path.join(app.instance_path, "flaskr.sqlite"),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile("config.py", silent=True)
    else:
        # load the test config if passed in
        app.config.update(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/cam',methods=['GET','POST'])
    def cam():
        return render_template('cam.html')

    @app.route('/menu',methods=['GET','POST'])
    def menu():
        return render_template('menu.html')

    @app.route('/menu2',methods=['GET','POST'])
    def menu2():
        return render_template('menu2.html')


    
    # app.register_blueprint(auth.bp)
    # app.register_blueprint(blog.bp)

    # make url_for('index') == url_for('blog.index')
    # in another app, you might define a separate main index here with
    # app.route, while giving the blog blueprint a url_prefix, but for
    # the tutorial the blog will be the main index
    app.add_url_rule("/", endpoint="index")

    return app

